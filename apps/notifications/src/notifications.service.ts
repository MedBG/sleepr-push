import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'

@Injectable()
export class NotificationsService {
private transporter: nodemailer.Transporter;

constructor(private readonly configService:ConfigService){
   this.transporter = nodemailer.createTransport({
service:'gmail',
auth: {
  type:'OAUTH2',
  user:this.configService.get('SMTP_USER'),
    clientId:this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
     clientSecret:this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
     refreshToken:this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
},

});
}



  async notifyEmail({email,text }: NotifyEmailDto) {
    await this.transporter.sendMail({
from:this.configService.get('SMTP_USER'),
to:email,
subject:'Sleepr Notification',
 text

    })
    console.log('[NOTIF] Email sent!');
  }
  
}
