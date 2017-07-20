module.exports = (value) => {
    return {
        assign: function (data) {
            return value = (data) ? data : value;
        },
        value: function () {
            return value;
        }
    };
};