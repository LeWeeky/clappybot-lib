/**
 * ClappyBot - A powerful framework for bot developers
 * Copyright (C) 2019–2025 LeWeeky
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { clappybot } from "../../main.js";

export function get_guilds_number() {
  let count = 0;

  clappybot.bot.guilds.cache.forEach((_guild) => {
    count++;
  });
  return count;
}

/**
 * 
 * @param {import("discord.js").GuildMember} member 
 * @param {string} content 
 * @param {{[key: string]: any} | null} target // TODO define type for target
 * @returns 
 */
export default async function replaceByVariables(
  member,
  content,
  target = null,
) {
  const guild = member.guild;

  while (["{user.pseudo}"].some((s) => content.includes(s))) {
    content = content.replace("{user.pseudo}", member.user.username);
  }

  while (["{user.tag}"].some((s) => content.includes(s))) {
    content = content.replace("{user.tag}", member.user.tag);
  }

  while (["{user.id}"].some((s) => content.includes(s))) {
    content = content.replace("{user.id}", member.id);
  }

  while (content.includes("{user.mention}")) {
    content = content.replace("{user.mention}", `<@${member.user.id}>`);
  }

  while (["{user.avatarURL}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{user.avatarURL}",
      member.user.displayAvatarURL({ size: 256 }),
    );
  }

  while (["{user.creation}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{user.creation}",
      member.user.createdAt.toLocaleDateString(),
    );
  }

  while (["{user.join}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{user.join}",
      member.joinedAt ? member.joinedAt.toLocaleDateString() : "Unknown date",
    );
  }

  while (["{members}"].some((s) => content.includes(s))) {
    content = content.replace("{members}", member.guild.memberCount.toString());
  }

  while (["{bots}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{bots}",
      guild.members.cache.filter((member) => member.user.bot).size.toString(),
    );
  }

  while (["{servers}"].some((s) => content.includes(s))) {
    content = content.replace("{servers}", get_guilds_number().toString());
  }

  while (["{users}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{users}",
      clappybot.bot.users.cache.filter((user) => !user.bot).size.toString(),
    );
  }

  while (["{humains}"].some((s) => content.includes(s))) {
    const humains_count =
      guild.memberCount -
      guild.members.cache.filter((member) => member.user.bot).size;
    content = content.replace("{humains}", humains_count.toString());
  }

  while (["{server.name}"].some((s) => content.includes(s))) {
    content = content.replace("{server.name}", guild.name);
  }

  while (["{server.iconURL}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{server.iconURL}",
      guild.iconURL() || "",
    );
  }

  while (["{server.creation}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{server.creation}",
      guild.createdAt.toLocaleDateString(),
    );
  }

  while (["{owner.id}"].some((s) => content.includes(s))) {
    content = content.replace("{owner.id}", guild.ownerId);
  }

  const owner = guild.members.cache.get(guild.ownerId);

  if (content.includes("{owner.tag}")) {
    const owner_tag = owner?.user.tag || "Unknown#0000";
    while (["{owner.tag}"].some((s) => content.includes(s))) {
      content = content.replace(
        "{owner.tag}",
        owner_tag,
      );
    }
  }

  while (["{owner.id}"].some((s) => content.includes(s))) {
    content = content.replace(
      "{owner.id}",
      guild.ownerId,
    );
  }

  if (content.includes("{owner.pseudo}")) {
    const owner_pseudo = owner?.user.username || "Unknown";
    while (["{owner.pseudo}"].some((s) => content.includes(s))) {
      content = content.replace(
        "{owner.pseudo}",
        owner_pseudo,
      );
    }
  }

  if (content.includes("{owner.created_at}")) {
    const owner_created_at = owner?.user.createdAt.toLocaleDateString() || "Unknown date";
    while (["{owner.created_at}"].some((s) => content.includes(s))) {
      content = content.replace(
        "{owner.created_at}",
        owner_created_at
      );
    }
  }


  while (["{prefix}"].some((s) => content.includes(s))) {
    content = content.replace("{prefix}", clappybot.config.prefix || "+");
  }

  if (target) {
    const Member = target["user"];
    const Role = target["role"];
    const Channel = target["channel"];

    if (Member) {
      while (["{target.user.pseudo}"].some((s) => content.includes(s))) {
        content = content.replace("{target.user.pseudo}", Member.user.username);
      }

      while (["{target.user.tag}"].some((s) => content.includes(s))) {
        content = content.replace("{target.user.tag}", Member.user.tag);
      }

      while (["{target.user.id}"].some((s) => content.includes(s))) {
        content = content.replace("{target.user.id}", Member.id);
      }

      while (["{target.user.avatarURL}"].some((s) => content.includes(s))) {
        content = content.replace(
          "{target.user.avatarURL}",
          Member.user.displayAvatarURL({ size: 256, dynamic: true }),
        );
      }

      while (["{target.user.creation}"].some((s) => content.includes(s))) {
        content = content.replace(
          "{target.user.creation}",
          Member.user.createdAt.toLocaleDateString(),
        );
      }

      while (["{target.user.join}"].some((s) => content.includes(s))) {
        content = content.replace(
          "{target.user.join}",
          Member.joinedAt.toLocaleDateString(),
        );
      }
    }

    if (Role) {
      while (["{target.role.color}"].some((s) => content.includes(s))) {
        if (guild.roles.cache.get(Role)?.colors.primaryColor) {
          content = content.replace("{target.role.color}", Role.color);
        } else {
          content = content.replace("{target.role.color}", "aucune");
        }
      }

      while (["{target.role.name}"].some((s) => content.includes(s))) {
        content = content.replace("{target.role.name}", Role.name);
      }

      while (["{target.role.id}"].some((s) => content.includes(s))) {
        content = content.replace("{target.role.id}", Role.name);
      }
    }

    if (Channel) {
      while (["{target.channel.name}"].some((s) => content.includes(s))) {
        content = content.replace("{target.channel.name}", Channel.name);
      }

      while (["{target.channel.id}"].some((s) => content.includes(s))) {
        content = content.replace("{target.channel.id}", Channel.id);
      }
    }
  }

  return content;
}
