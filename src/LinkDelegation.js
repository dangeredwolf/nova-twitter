
class LinkDelegation {
    static attach() {
        $(document).on("click",e => {
            console.log(e);
            e.originalEvent.path.forEach(a => {
                if (a.nodeName === "A") {
                    e.stopPropagation();
                    LinkDelegation.handleLink(a.href, e);
                }
            })
        })
    }
    static handleLink(link, e) {
        console.log("Hi, here's the link: "+ link);

        if (link.match(/^https?:\/\/twitter\.com\/([a-zA-Z0-9_-]+)(?:(?:\/status(?:es)?\/([0-9]+))?|(?:(\/(?:lists|timelines)\/)|\/)?([a-zA-Z0-9_-]+))\/?(\?.*)?$/) !== null) {
            console.log("This is a Twitter user URL. Therefore, we should open it up inline instead.");
            e.preventDefault();
        } else if (link.match(/^https?:\/\/twitter\.com\/(about|account|help|jobs|privacy|search|search\-advanced|search\-home|tos)/g) !== null) {
            console.log("This is a Twitter service link. Thus, there's something we could probably do here.")
        } else if (link.match(/^https?:\/\/twitter\.com\/[a-zA-Z0-9_]{1,15}\/status(es)?/g)) {
            console.log("This is a Tweet URL. We should probably do something with this.");
        } else if (link.match(/^https?:\/\/t\.co\//g)) {
            console.log("This is a t.co link, probably external?");
        } else {
            console.log("I have no idea what this is.");
        }
    }
}

exports.LinkDelegation = LinkDelegation;
