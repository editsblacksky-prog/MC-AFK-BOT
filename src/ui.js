// Made by Ayliee, All rights are reserved to AeroX Development

import {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
} from 'discord.js';

const FLAGS = MessageFlags.IsComponentsV2;

function thinDivider() {
  return new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(true);
}

function thinSpacer() {
  return new SeparatorBuilder().setSpacing(SeparatorSpacingSize.Small).setDivider(false);
}

function text(content) {
  return new TextDisplayBuilder().setContent(content);
}

// Single block of text in a container
export function msg(content) {
  const c = new ContainerBuilder();
  c.addTextDisplayComponents(text(content));
  return { components: [c], flags: FLAGS };
}

// Multiple text sections split by thin dividers
export function msgSections(...sections) {
  const c = new ContainerBuilder();
  sections.forEach((content, i) => {
    if (i > 0) c.addSeparatorComponents(thinDivider());
    c.addTextDisplayComponents(text(content));
  });
  return { components: [c], flags: FLAGS };
}

// Titled list: header + divider + one row per item + divider + optional footer
export function msgList(header, rows, footer) {
  const c = new ContainerBuilder();
  c.addTextDisplayComponents(text(header));
  c.addSeparatorComponents(thinDivider());

  rows.forEach((row, i) => {
    if (i > 0) c.addSeparatorComponents(thinSpacer());
    c.addTextDisplayComponents(text(row));
  });

  if (footer) {
    c.addSeparatorComponents(thinDivider());
    c.addTextDisplayComponents(text(footer));
  }

  return { components: [c], flags: FLAGS };
}

// Re-export builders so index.js can build the help command directly
export {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  MessageFlags,
  thinDivider,
  thinSpacer,
  text,
};
