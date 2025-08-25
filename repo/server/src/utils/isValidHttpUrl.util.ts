const pattern = /^(https?:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/;
function isValidHttpUrl(url: any): url is string {
    return pattern.test(url);
}
export default isValidHttpUrl