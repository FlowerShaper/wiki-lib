import { parseMarkdown } from '@comark/nuxt/parse';
import alert from '@comark/vue/plugins/alert';
import footnotes from '@comark/vue/plugins/footnotes';
import security from '@comark/vue/plugins/security';
import toc from '@comark/vue/plugins/toc';
import githubDark from '@shikijs/themes/github-dark';
import highlight from 'comark/plugins/highlight';
import wikiFootnotes from './plugins/md-footnotes';

import { MarkdownAlbumLink, MarkdownBlockquote, MarkdownCodeBlock, MarkdownH2, MarkdownH3, MarkdownImage, MarkdownTrackLink, NuxtLink } from '#components';

export default class Markdown {
    static FootnoteRegex = /\[\^(\d{1,2})\]/g;
    static BlockquoteRegex = /\{: \.(\w+) \}/g;

    static Components: Record<string, any> = {
        a: NuxtLink,
        h2: MarkdownH2,
        h3: MarkdownH3,
        img: MarkdownImage,
        pre: MarkdownCodeBlock,
        blockquote: MarkdownBlockquote,
        'track-link': MarkdownTrackLink,
        'album-link': MarkdownAlbumLink,
    };

    static async Parse(md: string) {
        const parsed = await parseMarkdown(md, {
            plugins: [
                footnotes({ hr: false, label: '' }),
                wikiFootnotes(),
                alert(),
                highlight({ themes: { dark: githubDark } }),
                security({
                    blockedTags: ['script', 'style', 'iframe'],
                }),
                toc(),
            ],
        });

        return parsed;
    }
}
