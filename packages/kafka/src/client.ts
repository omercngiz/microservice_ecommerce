import { Kafka, logLevel, type logCreator } from "kafkajs";
import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const pinoLogger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
          messageFormat: "[kafka/{namespace}] {msg}",
        },
      }
    : undefined,
});

const topinoLevel = (level: number) => {
  if (level === logLevel.ERROR) return "error";
  if (level === logLevel.WARN)  return "warn";
  if (level === logLevel.INFO)  return "info";
  return "debug";
};

const kafkaLogCreator: logCreator = (level) => ({ namespace, log }) => {
  const { message, ...extra } = log;
  pinoLogger[topinoLevel(level)]({ namespace, ...extra }, message);
};

export const createKafkaClient = (service: string) => {
  return new Kafka({
    clientId: service,
    brokers: ["localhost:9094", "localhost:9095", "localhost:9096"],
    logCreator: kafkaLogCreator,
  });
};