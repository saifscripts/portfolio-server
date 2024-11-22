export const replaceText = (
    template: string,
    replacements: { [key: string]: string },
) => {
    return template.replace(
        /{{(.*?)}}/g,
        (match, p1) => replacements[p1] || match,
    );
};
