

; (async () => {

    try {
        const [issuesElement] = await window.contentVar.getIssuesElements()
        if (issuesElement && Array.isArray(issuesElement.issues)) {
            const groupByTag = Object.groupBy(issuesElement.issues, ({ tag }) => tag)
            console.log(groupByTag)
            window.contentVar.analyze(groupByTag)
        }
    } catch (error) {
        console.log(error)
    }

})()