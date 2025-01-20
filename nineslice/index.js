class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
        var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexninepatchplugin.min.js';
        this.load.plugin('rexninepatchplugin', url, true);
      
        this.load.image('button', 'https://lukasmakegames.github.io/others/btn.png');
    }

    create() {
    this._w = window.innerWidth;
    this._h = window.innerHeight;
      
        this.add.rexNinePatch({
            x: 150, y: 150,
            width: this._w * 0.18, 
          height: this._h * 0.07,
            key: 'bg2',
            columns: [20, undefined, 20],
            rows: [20, undefined, 20],
        }).setOrigin(0).setScale(9)
        const menuItems = ["Roster", "Leaderboard", "Inventory", "Shop"];

    const menuContainer = this.add.container(this._w * 0.01, this._h * 0.3);
    // Add a background panel for the entire menu
    const panelBG = this.add
      .rectangle(0, 0, this._w * 0.2, this._h * 0.4, 0x222222)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xffffff); // Border for the menu panel
    // Styling for text items
    const textStyle = {
      font: "24px Roboto",
      color: "#5555ff",
      align: "center",
    };

    menuContainer.add(panelBG);
    const menuX = 10; // X position of the menu
    let menuY = 10; // Starting Y position of the menu
    const spacing = this._h*0.08; // Spacing between menu items

    menuItems.forEach((item, _index) => {
      // Create a container for each menu item
      const itemContainer = this.add.container(menuX, menuY);
      menuContainer.add(itemContainer);

      // Add a background rectangle for each menu item
      const itemBg = this.add
        .image(0, 0, "button")
        .setDisplaySize(this._w * 0.18, this._h * 0.07)
        .setOrigin(0);

      const itemText = this.add
        .text(
          itemBg.displayWidth / 2,
          itemBg.displayHeight / 2,
          item,
          textStyle
        )
        .setOrigin(0.5);

      // Add the background and text to the container
      itemContainer.add([itemBg, itemText]);

      // Make the container interactive
      itemBg // Set container size for interaction
        .setInteractive({ useHandCursor: true })
        .on("pointerover", () => itemText.setColor("#aa0000")) // Hover effect
        .on("pointerout", () => itemText.setColor("#5555ff")) // Reset hover effect
        .on("pointerdown", () => this.handleMenuSelection(item)); // Click event

      menuY += spacing; // Update Y position for the next item
    });

    }

    update() {
    }
}


var config = {
    type: Phaser.CANVAS,
    parent: 'game-container',
    width: 1024 ,
    height: 768,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: Demo
};

var game = new Phaser.Game(config);