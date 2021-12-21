//importing the libraries
const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');

const key_pair_a = nacl.box.keyPair();
const key_pair_b = nacl.box.keyPair();


function encrypt(original_message) {
    const shared_key = nacl.box.before(key_pair_b.publicKey, key_pair_a.secretKey);

    //create a one time code
    const one_time_code = nacl.randomBytes(24);

    //create cipher_text with one_time_code and shared_key
    const cipher_text = nacl.box.after(
        nacl.util.decodeUTF8(original_message),
        one_time_code,
        shared_key
    );

    //message to be transited.
    const message = { cipher_text, one_time_code };

    return message;
};


function decrypt(message) {
    //Getting user_b's shared key
    const shared_key = nacl.box.before(key_pair_a.publicKey, key_pair_b.secretKey);

    //Get the decoded message
    let decoded_message = nacl.box.open.after(message.cipher_text, message.one_time_code, shared_key);

    //Get the human readable message
    let plain_text = nacl.util.encodeUTF8(decoded_message)

    //return the message
    return plain_text;
}



original_message = "WEB3BRIDGE!"

encrypted_message = encrypt(original_message);
console.log("encrypted_message: ", encrypted_message)



decrypted_message = decrypt(encrypted_message)
console.log("decrypted message: ", decrypted_message)
