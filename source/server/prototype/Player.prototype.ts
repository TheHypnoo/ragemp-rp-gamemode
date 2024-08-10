import { RAGERP } from "@api";
import { inventoryAssets } from "@modules/inventory/Items.module";
import { RageShared } from "@shared/index";

mp.players.getPlayerByName = function (stringornumber: string): PlayerMp | undefined {
    if (!isNaN(parseInt(stringornumber))) {
        return mp.players.at(parseInt(stringornumber));
    } else {
        if (stringornumber.length < 3) return undefined;
        const players = mp.players.toArray();
        for (const player of players) {
            const [firstname] = player.name.split(" ");
            if (!firstname.toLowerCase().includes(stringornumber.toLowerCase())) continue;
            return player;
        }
    }
};

mp.Player.prototype.showNotify = function (type: RageShared.Enums.NotifyType, message: string, skin: "light" | "dark" | "colored" = "dark") {
    return RAGERP.cef.emit(this, "notify", "show", { type, message, skin });
};
mp.Player.prototype.getAdminLevel = function (): number {
    if (!this || !mp.players.exists(this) || !this.character) return 0;
    return this.character.adminlevel;
};

mp.Player.prototype.giveWeaponEx = function (this: PlayerMp, weapon: number, totalAmmo: number, ammoInClip?: number) {
    this.call("client::weapon:giveWeapon", [weapon, totalAmmo, ammoInClip]);
};

mp.Player.prototype.getRoleplayName = function (checkmask: boolean = true) {
    const player: PlayerMp = this;
    if (!player || !mp.players.exists(player) || !player.character) return "Unknown";
    if (checkmask && player.character.inventory && player.character.inventory.isWearingClothingType(inventoryAssets.INVENTORY_CLOTHING.TYPE_MASK)) {
        const itemData = player.character.inventory.items.clothes[inventoryAssets.INVENTORY_CLOTHING.TYPE_MASK];
        if (!itemData) return player.name;
        return `Stranger ${itemData.hash.split("-")[0]}`;
    }
    return this.name;
};

mp.Player.prototype.requestCollisionAt = async function (x: number, y: number, z: number) {
    return await this.callProc("client::proc:requestCollisionAt", [x, y, z]);
};

mp.Player.prototype.startScreenEffect = function (effectName: string, duration = 3000, looped: boolean = true) {
    this.call("client::effects:startScreenEffect", [effectName, duration, looped]);
};

mp.Player.prototype.stopScreenEffect = function (effectName: string) {
    this.call("client::effects:stopScreenEffect", [effectName]);
};

mp.Player.prototype.setEmoteText = function (color: Array4d, text: string, time: number = 7) {
    this.setVariable("emoteTextData", JSON.stringify({ color, text }));

    if (this.emoteTimeout) {
        clearTimeout(this.emoteTimeout);
        this.emoteTimeout = null;
    }

    this.emoteTimeout = setTimeout(() => {
        this.setVariable("emoteTextData", null);

        clearTimeout(this.emoteTimeout);
        this.emoteTimeout = null;
    }, time * 1_000);
};

mp.Player.prototype.giveMoney = function (amount: number, logMessage?: string) {
    if (!mp.players.exists(this) || !this.getVariable("loggedin") || !this.character) return;
    this.character.cash = this.character.cash + amount;
    this.character.setStoreData(this, "cash", this.character.cash);
};
