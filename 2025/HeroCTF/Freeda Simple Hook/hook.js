Java.perform(() => {
    const Vault = Java.use("com.heroctf.freeda1.utils.Vault");

    // Hook get_flag()
    Vault.get_flag.implementation = function () {
        console.log("[*] get_flag() called");

        let result = this.get_flag();
        console.log("[+] FLAG:", result);

        return result; // still return correct value to the app
    };

    // Optionally hook seed() as well
    const VaultClass = Java.use("com.heroctf.freeda1.utils.Vault");
    VaultClass.seed.implementation = function () {
        let s = this.seed();
        console.log("[+] seed() =", s);
        return s;
    };

    console.log("[*] Hook loaded!");
});
