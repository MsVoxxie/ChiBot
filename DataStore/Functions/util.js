const permissions = {
	ADMINISTRATOR: 'Administrator',
	VIEW_AUDIT_LOG: 'View Audit Log',
	MANAGE_GUILD: 'Manage Server',
	MANAGE_ROLES: 'Manage Roles',
	MANAGE_CHANNELS: 'Manage Channels',
	KICK_MEMBERS: 'Kick Members',
	BAN_MEMBERS: 'Ban Members',
	CREATE_INSTANT_INVITE: 'Create Instant Invite',
	CHANGE_NICKNAME: 'Change Nickname',
	MANAGE_NICKNAMES: 'Manage Nicknames',
	MANAGE_EMOJIS: 'Manage Emojis',
	MANAGE_WEBHOOKS: 'Manage Webhooks',
	VIEW_CHANNEL: 'Read Text Channels And See Voice Channels',
	SEND_MESSAGES: 'Send Messages',
	SEND_TTS_MESSAGES: 'Send TTS Messages',
	MANAGE_MESSAGES: 'Manage Messages',
	EMBED_LINKS: 'Embed Links',
	ATTACH_FILES: 'Attach Files',
	READ_MESSAGE_HISTORY: 'Read Message History',
	MENTION_EVERYONE: 'Mention Everyone',
	USE_EXTERNAL_EMOJIS: 'Use External Emojis',
	ADD_REACTIONS: 'Add Reactions',
	CONNECT: 'Connect',
	SPEAK: 'Speak',
	MUTE_MEMBERS: 'Mute Members',
	DEAFEN_MEMBERS: 'Deafen Members',
	MOVE_MEMBERS: 'Move Members',
	USE_VAD: 'Use Voice Activity',
};

const guildFeatures = {
	ANIMATED_ICON: 'Animated Icon',
	BANNER: 'Banner',
	COMMERCE: 'Commerce',
	COMMUNITY: 'Community Server',
	DISCOVERABLE: 'Public',
	INVITE_SPLASH: 'Invite Image',
	NEWS: 'News Channel',
	PARTNERED: 'Discord Partner',
	RELAY_ENABLED: 'Relay Enabled',
	VANITY_URL: 'Vanity Invite',
	VERIFIED: 'Verified',
	VIP_REGIONS: 'Premium Region',
	WELCOME_SCREEN_ENABLED: 'Welcome Screen',
	MEMBER_VERIFICATION_GATE_ENABLED: 'Member Verification',
};

const Emoji = ['๐', '๐', '๐', '๐', '๐', '๐', '๐คฃ', '๐', '๐', '๐', '๐', '๐', '๐', '๐ฅฐ', '๐', '๐คฉ', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐คช', '๐', '๐ค', '๐ค', '๐คญ', '๐คซ', '๐ค', '๐ค', '๐คจ', '๐', '๐', '๐ถ', '๐ถโ', '๐ถโ', '๐', '๐', '๐', '๐ฌ', '๐ฎโ๐จ', '๐คฅ', '๐', '๐', '๐ช', '๐คค', '๐ด', '๐ท', '๐ค', '๐ค', '๐คข', '๐คฎ', '๐คง', '๐ฅต', '๐ฅถ', '๐ฅด', '๐ต', '๐ตโ๐ซ', '๐คฏ', '๐ค ', '๐ฅณ', '๐', '๐ค', '๐ง', '๐', '๐', '๐', 'โน๏ธ', 'โน', '๐ฎ', '๐ฏ', '๐ฒ', '๐ณ', '๐ฅบ', '๐ฆ', '๐ง', '๐จ', '๐ฐ', '๐ฅ', '๐ข', '๐ญ', '๐ฑ', '๐', '๐ฃ', '๐', '๐', '๐ฉ', '๐ซ', '๐ฅฑ', '๐ค', '๐ก', '๐ ', '๐คฌ', '๐', '๐ฟ', '๐', 'โ ๏ธ', 'โ ', '๐ฉ', '๐คก', '๐น', '๐บ', '๐ป', '๐ฝ', '๐พ', '๐ค', '๐บ', '๐ธ', '๐น', '๐ป', '๐ผ', '๐ฝ', '๐', '๐ฟ', '๐พ', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', 'โฃ๏ธ', 'โฃ', '๐', 'โค๏ธ', 'โค', '๐งก', '๐', '๐', '๐', '๐', '๐ค', '๐ค', '๐ค', '๐ฏ', '๐ข', '๐ฅ', '๐ซ', '๐ฆ', '๐จ', '๐ณ๏ธ', '๐ณ', '๐ฃ', '๐ฌ', '๐๏ธโ๐จ๏ธ', '๐จ๏ธ', '๐จ', '๐ฏ๏ธ', '๐ฏ', '๐ญ', '๐ค', '๐'];

const canModifyQueue = async (member) => {
	const { channelID } = member.voice;
	const botChannel = member.guild.voice.channelID;

	if (channelID !== botChannel) {
		member.send('You need to join the voice channel first!').catch(console.error);
		return;
	}

	return true;
};

const createBar = (total, current, size = 40, line = 'โฌ', slider = '๐') => {
	if (!total) throw new Error('Total value is either not provided or invalid');
	if (!current) throw new Error('Current value is either not provided or invalid');
	if (isNaN(total)) throw new Error('Total value is not an integer');
	if (isNaN(current)) throw new Error('Current value is not an integer');
	if (isNaN(size)) throw new Error('Size is not an integer');
	if (current > total) {
		const bar = line.repeat(size + 2);
		const percentage = (current / total) * 100;
		return [bar, percentage];
	}
	else {
		const percentage = current / total;
		const progress = Math.round((size * percentage));
		const emptyProgress = size - progress;
		const progressText = line.repeat(progress).replace(/.$/, slider);
		const emptyProgressText = line.repeat(emptyProgress);
		const bar = progressText + emptyProgressText;
		const calculated = percentage * 100;
		return [bar, calculated];
	}
};

module.exports = {
	permissions,
	guildFeatures,
	Emoji,
	canModifyQueue,
	createBar,
};