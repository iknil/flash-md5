//
// Created by iknil on 2021/5/12.
//

#ifndef WEB_STREAMING_MD5_MAIN_H
#define WEB_STREAMING_MD5_MAIN_H

# define CHUCK_SIZE 1048576 * 5 // 5MB

enum STATUS
{
    INIT, STARTING, STARTED, UPDATING, UPDATED, ENDING, GETSTATING, GETSTATED, SETSTATING, SETSTATED
};

enum STATUS s_status;
unsigned char md5_result[MD5_DIGEST_LENGTH];
MD5_CTX md_context;

char *s_path;
unsigned char data[CHUCK_SIZE];

int isDestroy = 0;
char *restore_buffer;

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t  cond  = PTHREAD_COND_INITIALIZER;
pthread_t pid;

#endif //WEB_STREAMING_MD5_MAIN_H
