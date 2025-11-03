const { data, reviews } = require("./content");

const renderContent = () => {
    const cont = data.map(upgrade => `
        <div>
            <div>
                <img src="${upgrade.image}">
            </div>
            <a href="${upgrade.url}">${upgrade.text}</a>
        </div>
        `).join('');
    return cont;
};

const renderReviews = () => {
    const revs = reviews.map(review => `
        <li>
            "${review.text}"
            <p>${review.rating}</p>
        </li>
        `).join('');
    return revs;
};

module.exports = { renderContent, renderReviews };