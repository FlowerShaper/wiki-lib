<script setup lang="ts">
import { MarkdownAlbumLink, MarkdownBlockquote, MarkdownCodeBlock, MarkdownH2, MarkdownH3, MarkdownImage, MarkdownTrackLink, NuxtLink } from '#components';
import alert from '@comark/vue/plugins/alert';
import footnotes from '@comark/vue/plugins/footnotes';
import security from '@comark/vue/plugins/security';
import githubDark from '@shikijs/themes/github-dark';
import highlight from 'comark/plugins/highlight';
import wikiFootnotes from '../../utils/plugins/md-footnotes';
import { Comark } from '@comark/vue';

const props = defineProps<{
    content: string;
}>();

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

const plugins: any = [
    footnotes({ hr: false, label: '' }),
    wikiFootnotes(),
    alert(),
    highlight({ themes: { dark: githubDark } }),
    security({
        blockedTags: ['script', 'style', 'iframe'],
    }),
];
</script>

<template>
    <Comark class="md-content" :components="components" :plugins="plugins">{{ content }}</Comark>
</template>
