<script setup lang="ts">
import {
    MarkdownAlbumLink,
    MarkdownBlockquote,
    MarkdownCodeBlock,
    MarkdownDocument,
    MarkdownH2,
    MarkdownH3,
    MarkdownImage,
    MarkdownTrackLink,
    NuxtLink,
} from '#components';
import alert from '@comark/vue/plugins/alert';
import footnotes from '@comark/vue/plugins/footnotes';
import security from '@comark/vue/plugins/security';
import toc from '@comark/vue/plugins/toc';
import githubDark from '@shikijs/themes/github-dark';
import { parseMarkdown } from 'comark';
import highlight from 'comark/plugins/highlight';
import wikiFootnotes from '../../utils/plugins/md-footnotes';

const props = defineProps<{
    content: string;
}>();

const parsed = await parseMarkdown(props.content, {
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

const components: Record<string, any> = {
    a: NuxtLink,
    h2: MarkdownH2,
    h3: MarkdownH3,
    img: MarkdownImage,
    pre: MarkdownCodeBlock,
    blockquote: MarkdownBlockquote,
    'track-link': MarkdownTrackLink,
    'album-link': MarkdownAlbumLink,
};

defineExpose({ parsed });
</script>

<template>
    <MarkdownDocument class="md-content" :value="parsed" :components="components"></MarkdownDocument>
</template>
