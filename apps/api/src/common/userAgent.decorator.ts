import { createParamDecorator } from '@nestjs/common';
import { UAParser, IResult } from 'ua-parser-js';

export type AgentDetail = {
  ua: string;
  browser: { name: string; version: string; major: string };
  engine: { name: string; version: string };
  os: { name: string; version: string };
  device: { vendor: any; model: any; type: any };
  cpu: { architecture: string };
};

export const UserAgent = createParamDecorator((data, req): IResult => UAParser(req.args[0].headers['user-agent']));
