///////////////////////// Program for data tranmission to a server build with NodeJs   ///////
#include <18F4550.h>
#fuses HS,NOPROTECT,NOWDT
#use delay(crystal=20M)
#use rs232(rcv=PIN_C7,xmit=PIN_C6,baud=9600,bits=8,parity=N)
#include <STDLIB.H>
#include <math.h>

#define SAMPLES 10
#define TIME_DELAY 400
#define BUF_LENGTH 32
#define START_CONVEYOR PIN_A0

float32 signal;
int LampKitchenOn[9]={'i','&','l','1','&','O','n',0x0a,0};
int LampKitchenOff[10]={'i','&','l','1','&','O','f','f',0x0a,0};
int LampLivingOn[9]={'i','&','l','2','&','O','n',0x0a,0};
int LampLivingOff[10]={'i','&','l','2','&','O','f','f',0x0a,0};
int LampBathroomOn[9]={'i','&','l','3','&','O','n',0x0a,0};
int LampBathroomOff[10]={'i','&','l','3','&','O','f','f',0x0a,0};

int samplingOn[9]={'i','&','l','4','&','O','n',0x0a,0};
int samplingOff[10]={'i','&','l','4','&','O','f','f',0x0a,0};

int buf[BUF_LENGTH],str[BUF_LENGTH],str_flag=0,i=0,j=0;
char datum;
int8 sample;
int1 oneShootOn=1;
int1 oneShootOff=1;
int isStarChart=0;
#int_rda
void isr() {
   datum=getchar();
   buf[i]=datum;
   if(buf[i]==0x0a){
      str_flag=1;
      buf[i+1]=0;
      strcpy(str,buf);   
      for(j=0;j<5;j++){
        buf[j]=0;
      }  
      i=0;
   }
   else
      i++;
}

void initialConfigurations(){
   enable_interrupts(INT_RDA);
   enable_interrupts(GLOBAL);   
   //printf("[------------- TEST FOR NODEJS CONNECTION ---------------]");
   printf("start");
   DELAY_MS(300);
}

void main(){
   initialConfigurations();
   while(1){
      int index=0;
      signal=0;     
   if(strcmp(LampKitchenOn,str)==0)
      output_high(PIN_C1);     
   else if(strcmp(LampKitchenOff,str)==0)
      output_low(PIN_C1);
   else if(strcmp(LampLivingOn,str)==0)
      output_high(PIN_C2);     
   else if(strcmp(LampLivingOff,str)==0)
      output_low(PIN_C2);
   else if(strcmp(LampBathroomOn,str)==0)
      output_high(PIN_C4);     
   else if(strcmp(LampBathroomOff,str)==0)
      output_low(PIN_C4);    
   if(input(START_CONVEYOR)&&oneShootOn)
   {       
      int8 i;
      for(i=0;i<3;i++)
      {
         printf("[i&a1&On]");
         delay_ms(100);
      }
       oneShootOff=1;
       oneShootOn=0;
   }
   else if(!input(START_CONVEYOR)&&oneShootOff)
   {
      int8 i;
      for(i=0;i<3;i++)
      {
          printf("[i&a1&Off]");
          delay_ms(100);
      }
       oneShootOn=1;
       oneShootOff=0;
   }   
   if(strcmp(samplingOn,str)==0)
      isStarChart=1;
   else if(strcmp(samplingOff,str)==0)
      isStarChart=0;
   sample=rand()%150+5;
   if(isStarChart)   
      printf("[s&t1&%d]",sample);
   delay_ms(TIME_DELAY);
   }
}
