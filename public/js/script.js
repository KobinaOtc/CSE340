import { data } from "./content";

export const renderContent = () => {
    data.map(upgrade => `
        <div>
            <div>
                <img src="${upgrade.image}">
            </div>
            <a href="${upgrade.url}">${upgrade.text}</a>
        </div>
        `).join('');
}