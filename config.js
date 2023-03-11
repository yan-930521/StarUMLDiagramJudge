module.exports = {
    server: {
        url: "http://localhost:3000/" //120.108.204.99
    },
    dev: true,
    url: null,
    Types: {
        STATUS: {
            "ONLINE": 1,
            "OFFLINE": 2,
            "USERNOTFOUND": 3
        }
    },
    checkLoginInterval: 15,
    css: {
        questionPage: {
            style: {
                backgroundColor: "gray",
                zIndex: 2,
                right: 0,
                position: "absolute",
                height: "100%",
                width: "50%",
                userSelect: "text",
                right: 0,
                top: 0
            }
        }
    }
    
}