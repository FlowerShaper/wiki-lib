export type WikiArticle = {
    url: string;
    lang: string;
    meta: WikiArticleMetadata;
    content: string;
};

export type WikiArticleMetadata = {
    title: string;
    description: string;
    author: string;
    image: string;
    layout: string;
    type: WikiArticleType;
    date: number;
};

export enum WikiArticleType {
    ARTICLE = 1,
    NEWS = 2,
    BLOG = 3,
    NEW_RELEASE = 4,
}
