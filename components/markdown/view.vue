<script setup lang="ts">
import Markdown from '../../utils/markdown';

const props = defineProps<{
    content: string;
}>();

const { data } = useAsyncData<ParsedMarkdown>(
    () => 'markdown-content',
    async () => await Markdown.Parse(props.content),
    { watch: [() => props.content] },
);
defineExpose({ data });
</script>

<template>
    <MarkdownDocument class="md-content" :value="data" :components="Markdown.Components"></MarkdownDocument>
</template>
