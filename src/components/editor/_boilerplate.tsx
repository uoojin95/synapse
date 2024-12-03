import {
  markdownShortcutPlugin,
  frontmatterPlugin,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
} from '@mdxeditor/editor';

export const ALL_PLUGINS = [
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  frontmatterPlugin(),
  markdownShortcutPlugin()
]
