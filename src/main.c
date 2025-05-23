#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <emscripten/emscripten.h>
#include <emscripten/console.h>
#include <emscripten/html5.h>

#include <openssl/md5.h>
#include "main.h"

void worker() {
    switch (s_status)
    {
        case INIT:
            break;
        case STARTING:
            MD5_Init(&md_context);

            s_status = STARTED;

            MAIN_THREAD_EM_ASM(Module["callback"] && Module["callback"]());
            break;
        case GETSTATING: {
            char output[184 + 1];
            char initChars[92 + 1];
            uint32_t *sptr = (uint32_t *)initChars;
            sptr[0] = md_context.A;  sptr[1] = md_context.B;  sptr[2] = md_context.C;  sptr[3] = md_context.D;
            sptr[4] = md_context.Nl; sptr[5] = md_context.Nh;
            memcpy(&sptr[6], md_context.data, 16 * sizeof(uint32_t));
            sptr[22] = md_context.num;

            for (int i = 0; i < 23; i++) {
                sprintf(output + i * 8, "%08x", sptr[i]);
            }
            output[184] = '\0';
            s_status = GETSTATED;

            EM_ASM_({
                console.log("state (string):", UTF8ToString($0));
            }, output);

            MAIN_THREAD_EM_ASM(Module["callback"] && Module["callback"](UTF8ToString($0)), output);
            break;
        }
        case SETSTATING:{
            uint32_t buffer[23];
    
            for (int i = 0; i < 23; i++) {
                sscanf(restore_buffer + i * 8, "%8x", &buffer[i]);
            }

            md_context.A = buffer[0];  md_context.B = buffer[1];  md_context.C = buffer[2];  md_context.D = buffer[3];
            md_context.Nl = buffer[4]; md_context.Nh = buffer[5];
            memcpy(md_context.data, &buffer[6], 16 * sizeof(uint32_t));
            md_context.num = buffer[22];

            s_status = SETSTATED;
            MAIN_THREAD_EM_ASM(Module["callback"] && Module["callback"]());
            break;
        }
        case UPDATING:
            if (s_path != NULL) {
                FILE *inFile = fopen(s_path, "rb");
                int bytes;

                while ((bytes = fread(data, 1, CHUCK_SIZE, inFile)) != 0) {
                    MD5_Update(&md_context, data, bytes);
                }
                fclose(inFile);
                s_path = NULL;
            }
            
            s_status = UPDATED;

            MAIN_THREAD_EM_ASM(Module["callback"] && Module["callback"]());
            break;
        case ENDING:
            MD5_Final (md5_result, &md_context);
            char tmp[3]={},buf[33]={};

            for(int i = 0; i < MD5_DIGEST_LENGTH; i++) {
                sprintf(tmp, "%2.2x", md5_result[i]);
                strcat(buf, tmp);
            }

            s_path = NULL;
            s_status = INIT;
            MAIN_THREAD_EM_ASM(Module["callback"] && Module["callback"](UTF8ToString($0)), buf);
            break;
        default:
            break;
    }
}

void EMSCRIPTEN_KEEPALIVE start() {
    s_path = NULL;
    s_status = STARTING;

    worker();
}

void EMSCRIPTEN_KEEPALIVE update(char* path) {
    s_path = path;
    s_status = UPDATING;

    worker();
}

void EMSCRIPTEN_KEEPALIVE state() {
    s_status = GETSTATING;

    worker();
}

void EMSCRIPTEN_KEEPALIVE restore(char* str) {
    restore_buffer = str;
    s_status = SETSTATING;

    worker();
}

void EMSCRIPTEN_KEEPALIVE end() {
    s_status = ENDING;

    worker();
}
