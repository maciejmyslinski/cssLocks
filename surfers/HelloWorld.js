import React from 'react';
import { CodeSurfer } from 'mdx-deck-code-surfer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import helloWorld from '../examples/helloWorld.example';

export const HelloWorld = () => <CodeSurfer code={helloWorld} theme={vsDark} />;
