import type { Toc } from '@comark/nuxt/plugins/toc';
import type { MarkdownDocument } from 'comark';

export type ParsedMarkdown = MarkdownDocument<{ toc: Toc } & Record<string, unknown>, Record<string, any>>;
