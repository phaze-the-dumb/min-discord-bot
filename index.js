const { Schematic } = require('mindustry-schematic-parser');
const discord = require('discord.js');
const fetch = require('node-fetch');
const bot = new discord.Client({ intents: [ discord.Intents.FLAGS.GUILDS, discord.Intents.FLAGS.GUILD_MESSAGES ] });

let icons = {
    copper: '<:copper:908397525772402798>',
    lead: '<:lead:908397525696913458>',
    graphite: '<:graphite:908397525680136203>',
    titanium: '<:titanium:908397525726289920>',
    thorium: '<:thorium:908397525659181067>',
    coal: '<:coal:908397525373964299>',
    'metaglass': '<:metaglass:908397525638197248>',
    plastanium: '<:plastanium:908397525436862465>',
    'phase-fabric': '<:phasefabric:908397525667573852>',
    pytatite: '<:pyratite:949649076255854613>',
    'blast-compound': '<:blastcompound:949649037932519435>',
    'surge-alloy': '<:surgealloy:949648971612192790>',
    silicon: '<:silicon:949648919426641961>',
    'spore-pod': '<:sporepod:949648865286570025>',
    sand: '<:sand:949648793261973554>',
    scrap: '<:scrap:949648725108719626>'
};

let getIcons = name => {
    return icons[name] || name;
}

bot.on('ready', () => {
    console.log('Logged In As: '+bot.user.username);
});

bot.on('messageCreate', async msg => {
    if(msg.author.bot)return;
    if(msg.channel.type === "dm")return;

    let base64 = msg.content

    if(msg.attachments.first() && msg.attachments.first().name === 'message.txt'){
        let data = await fetch(msg.attachments.first().url);
        base64 = await data.text();
    }

    if(Buffer.from(base64, 'base64').toString('base64') === base64){
        try{
            const schematic = Schematic.decode(base64)
            
            schematic
                .toImageBuffer()
                .then(buffer => {
                    let discordImage = new discord.MessageAttachment(buffer, 'sch-img.png');

                    const embed = new discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`Name: ${schematic.name}`)
                        .setDescription(`Desc: ${schematic.description}`)
                        .addFields([
                            {
                                name: '⚡',
                                value: `${schematic.powerBalance}`
                            }
                        ])
                        .setImage('attachment://sch-img.png');

                    let values = Object.values(schematic.requirements);
                    let keys = Object.keys(schematic.requirements);
                    let i = 0;

                    keys.forEach(k => {
                        console.log(`${getIcons(k)}`, `${values[i]}`)
                        embed.addFields({
                            name: `${getIcons(k)}`,
                            value: `${values[i]}`,
                            inline: true
                        });

                        i++;
                    })

                    msg.channel.send({ embeds: [ embed ], files: [ discordImage ] });
                })
        } catch(e){
            console.log(e)
        }
    }
})

bot.login(require('./config.json').token)