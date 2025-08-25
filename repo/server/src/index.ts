import VirtualDom from "./services/virtualDom.service";


(async () => {
    const dom = new VirtualDom({
        path: "https://qadigitalads.com/"
    })
    await dom.start()
    await dom.validateDom()
    console.log(dom.component?.issues)
})()