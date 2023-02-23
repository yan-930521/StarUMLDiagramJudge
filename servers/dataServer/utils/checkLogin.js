module.exports = (acc, pwd) => {
    let test_data = {
        "acc1": "pwd1",
        "acc2": "pwd2"
    }

    let status = false;

    if (test_data[acc] && pwd == test_data[acc]) {
        status = true;
    }

    return status;

}