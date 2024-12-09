export interface IProject {
    name: string;
    slug: string;
    description: string;
    summary: string;
    content: string;
    images: string[];
    live: string;
    repos: [{ label: string; url: string }];
    techs: string[];
    isDeleted: boolean;
}
