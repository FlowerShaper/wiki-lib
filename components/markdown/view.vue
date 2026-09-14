<script setup lang="ts">
import Markdown from '../../utils/markdown';

const props = defineProps<{
    content: string;
}>();

const parsed = await Markdown.Parse(props.content);
defineExpose({ parsed });
</script>

<template>
    <MarkdownDocument class="md-content" :value="parsed" :components="Markdown.Components"></MarkdownDocument>
</template>
