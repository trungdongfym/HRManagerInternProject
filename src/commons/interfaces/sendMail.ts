export interface ISendMail {
   from: string;
   to: Array<string>;
   subject: string;
   html?: any;
   text?: string;
}

export interface ISendMailSes {
   destinationsEmail: any;
   sourceEmail: string;
   subject: string;
   html?: any;
   text?: any;
}
