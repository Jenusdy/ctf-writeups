// frida-hook-vault.js

// Wait for the Java runtime to be ready
Java.perform(() => {
    // Find the Vault class
    const Vault = Java.use('com.heroctf.freeda2.utils.Vault');

    // Hook the get_flag() static method
    Vault.get_flag.implementation = function() {
        console.log('[*] get_flag() called');

        // Call the original method
        const original = this.get_flag();

        console.log('[*] Original flag:', original);

        // Optionally, you can modify the return value
        // const fakeFlag = "FAKE_FLAG{HOOKED}";
        // console.log('[*] Returning fake flag:', fakeFlag);
        // return fakeFlag;

        return original; // Return the original
    };

    console.log('[*] Vault.get_flag() hook installed');
});
