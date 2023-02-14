function optional(raw, Type) {
  if (raw) {
    if ([String, Number, Boolean].includes(Type)) return Type(raw)
    return new Type(raw)
  }
  return null
}

class TgCallbackQuery {
  constructor(raw) {
    this.id = String(raw.id)
    this.from = new TgUser(raw.from)
    this.data = String(raw.data)
    this.message = optional(raw.message, TgMessage)
    this.inline_message_id = optional(raw.inline_message_id, String)
  }
}

class TgUser {
  constructor(raw) {
    this.id = Number(raw.id)
    this.firstName = String(raw.first_name)
    this.lastName = optional(raw.last_name, String)
    this.username = optional(raw.username, String)
  }
}

class TgChat {
  constructor(raw) {
    this.id = raw.id
    this.type = raw.type
    this.title = optional(raw.title, String)
    this.username = optional(raw.username, String)
    this.firstName = optional(raw.first_name, String)
    this.lastName = optional(raw.last_name, String)
    this.allMembersAreAdmins = optional(raw.all_members_are_administrators, Boolean)
  }
}

class TgMessage {
  constructor(raw) {
    this.id = Number(raw.message_id)
    this.from = optional(raw.from, TgUser)
    this.date = new Date(raw.date*1000)
    this.chat = new TgChat(raw.chat)
    this.forwardFrom = optional(raw.forward_from, TgUser)
    this.forwardDate = optional(raw.forward_date*1000, Date)
    this.replayTo = optional(raw.replay_to_message, TgMessage)
    this.text = optional(raw.text, String)
    this.caption = optional(raw.caption, String)
    this.newChatMember = optional(raw.new_chat_member, TgUser)
    this.leftChatMember = optional(raw.left_chat_member, TgUser)
    this.newChatTitle = optional(raw.new_chat_title, String)
    this.deleteChatPhoto = optional(raw.deleteChatPhoto, Boolean)
    this.groupChatCreated = optional(raw.group_chat_created, Boolean)
    this.supergroupChatCreated = optional(raw.supergroup_chat_created, Boolean)
    this.migrateToChatId = optional(raw.migrate_to_chat_id, Number)
    this.migrateFromChatId = optional(raw.migrateFromChatId, Number)
    this.pinnedMessage = optional(raw.pinned_message, TgMessage)
  }
}

class TgUpdate {
  constructor(raw) {
    this.id = Number(raw.update_id)
    this.message = optional(raw.message, TgMessage)
    this.callbackQuery = optional(raw.callback_query, TgCallbackQuery)
  }

  static fromArray(rawArray = []) {
    return rawArray.map(raw => new TgUpdate(raw))
  }
}

module.exports = {
  TgMessage,
  TgUpdate,
  TgUser,
}
