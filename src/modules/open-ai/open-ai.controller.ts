import { Body, Controller, Get, Header, Post, Res } from '@nestjs/common';
import { OpenAiService } from './open-ai.service';
import { Public } from '@/common/decorators';
import { ChatDto } from './dto';
import { ProxyHttpService } from '@/shared/proxyHttp/proxyHttp.service';
import { Response } from 'express';

@Controller('openai')
export class OpenAiController {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly proxyHttpService: ProxyHttpService,
  ) {}

  @Post('chat')
  @Public()
  // @Header('Content-Type', 'text/event-stream')
  // @Header('Content-Type', 'text/plain')
  async chartGpt(@Body() data: ChatDto, @Res() res: Response) {
    // const { data: response } = await this.proxyHttpService.openAiHttp({
    //   method: 'POST',
    //   url: '/chat/completions',
    //   data: {
    //     model: 'gpt-3.5-turbo',
    //     messages: [{ role: 'system', content: data.content }],
    //     max_tokens: 1024,
    //     temperature: 0.6,
    //     stream: true,
    //   },
    //   responseType: 'stream',
    // });
    // response.pipe(res);

    const textDecoder = new TextDecoder();
    const stream = this.openAiService.getStreamResponse(data.content);
    for await (const chunk of (stream as any).toReadableStream()) {
      const data = textDecoder.decode(chunk);
      console.log('data ------', data);
      res.write(data);
    }
    res.end();

    // const stream = this.openAiService.getStreamResponse(data.content);
  }
}
