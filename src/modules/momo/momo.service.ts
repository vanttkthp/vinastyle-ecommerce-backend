import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateMomoPaymentDto } from './dto/create-momo-payment.dto';

@Injectable()
export class MomoService {
  private accessKey: string;
  private secretKey: string;
  private partnerCode: string;
  private redirectUrl: string;
  private ipnUrl: string;
  private requestType: string = 'payWithMethod';
  private autoCapture: boolean = true;
  private lang: string = 'en';

  constructor(private configService: ConfigService) {
    this.accessKey = this.configService.get<string>('MOMO_ACCESS_KEY');
    this.secretKey = this.configService.get<string>('MOMO_SECRET_KEY');
    this.partnerCode = this.configService.get<string>('MOMO_PARTNER_CODE');
    this.redirectUrl = this.configService.get<string>('MOMO_REDIRECT_URL');
    this.ipnUrl = this.configService.get<string>('MOMO_IPN_URL');
  }

  async createPayment(dto: CreateMomoPaymentDto) {
    const orderId = dto.orderId;
    const extraData = '';
    const requestId = orderId;
    const rawSignature = `accessKey=${this.accessKey}&amount=${dto.amount}&extraData=${extraData}&ipnUrl=${this.ipnUrl}&orderId=${orderId}&orderInfo=pay with MoMo&partnerCode=${this.partnerCode}&redirectUrl=${this.redirectUrl}&requestId=${requestId}&requestType=${this.requestType}`;
    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId,
      amount: dto.amount,
      orderId,
      orderInfo: 'pay with MoMo',
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang: this.lang,
      requestType: this.requestType,
      autoCapture: this.autoCapture,
      extraData: '',
      orderGroupId: '',
      signature,
    });

    try {
      const { data } = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/create',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
          },
        },
      );
      return data;
    } catch (error) {
      throw new Error('Error creating payment');
    }
  }

  async checkTransactionStatus(orderId: string) {
    const rawSignature = `accessKey=${this.accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.partnerCode,
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'en',
    });

    try {
      const { data } = await axios.post(
        'https://test-payment.momo.vn/v2/gateway/api/query',
        requestBody,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      return data;
    } catch (error) {
      throw new Error('Error checking payment status');
    }
  }
}
