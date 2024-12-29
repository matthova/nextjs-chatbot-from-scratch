import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  boolean,
} from "drizzle-orm/pg-core";

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  // userId: uuid('userId')
  //   .notNull()
  //   .references(() => user.id),
});
export type Chat = InferSelectModel<typeof chat>;

export const message = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});
export type Message = InferSelectModel<typeof message>;

export const battle = pgTable("Battle", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  modelAChatId: uuid("modelAChatId")
    .notNull()
    .references(() => chat.id),
  modelBChatId: uuid("modelBChatId")
    .notNull()
    .references(() => chat.id),
  modelAId: varchar("modelAId").notNull(),
  modelBId: varchar("modelBId").notNull(),
  modelsRevealed: boolean("modelsRevealed").notNull().default(false),
});
export type Battle = InferSelectModel<typeof battle>;
