import '@egret-r/eui';
export function showCaseError(root, title, detail) {
    const titleLabel = new eui.Label();
    titleLabel.x = 40;
    titleLabel.y = 112;
    titleLabel.size = 22;
    titleLabel.textColor = 0xb91c1c;
    titleLabel.text = title;
    root.addChild(titleLabel);
    const detailLabel = new eui.Label();
    detailLabel.x = 40;
    detailLabel.y = 148;
    detailLabel.size = 16;
    detailLabel.textColor = 0x7f1d1d;
    detailLabel.lineSpacing = 8;
    detailLabel.text = detail;
    root.addChild(detailLabel);
}
