const qrcode = require("qrcode-terminal");
const { contacts } = require("./contacts");
const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({ authStrategy: new LocalAuth() });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

async function sendMessageToContacts() {
  let number = 1;
  for (const contact of contacts) {
    try {
      const customMsg = `Selamat pagi Pak/Bu ${contact.name}. Dengan jabatan ${contact.jabatan} dari instansi ${contact.intansi} jangan lupa hadir rapat.\n\n\n Link zoom anda : https://aaa.com\n\nFormat nama : ${contact.customId}
    \n\nJika ada pertanyaan tolong balas dengan : TANYA`;

      await client.sendMessage(contact.phoneNumber, customMsg);

      console.log(`${number++} success send message to ${contact.name}`);
    } catch (e) {
      console.log(e);
    }
  }
}

async function replyMessageHelp() {
  client.on("message", (message) => {
    if (message.body.toUpperCase() === "TANYA") {
      try {
        message.reply("Mohon tunggu kami membalas");
        console.log(`success sending response message to ${message.from}`);
      } catch (error) {
        console.log(`failed sending response message to ${message.from}`);
      }
    }
  });
}

client.on("ready", async () => {
  console.log("Client is ready!");
  // await sendMessageToContacts();
  // await replyMessageHelp();
});

client.initialize();
