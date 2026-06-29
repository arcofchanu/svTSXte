import { ConversionDirection } from '../types';

export function convertCode(code: string, direction: ConversionDirection): string {
  if (!code) return '';

  if (direction === 'tsx-to-svelte') {
    return convertTsxToSvelte(code);
  } else {
    return convertSvelteToTsx(code);
  }
}

function convertTsxToSvelte(code: string): string {
  let svelteCode = code;
  
  // Remove React imports
  svelteCode = svelteCode.replace(/import React[^;]*;\n?/g, '');
  svelteCode = svelteCode.replace(/import\s+\{.*?\}\s+from\s+['"]react['"];\n?/g, '');
  
  // Convert useState
  svelteCode = svelteCode.replace(/const\s+\[([^,]+),\s*set[A-Z][a-zA-Z0-9]*\]\s*=\s*useState(?:<[^>]+>)?\((.*?)\);/g, 'let $1 = $2;');
  
  // Convert basic attributes
  svelteCode = svelteCode.replace(/className=/g, 'class=');
  svelteCode = svelteCode.replace(/onClick=/g, 'on:click=');
  svelteCode = svelteCode.replace(/onChange=/g, 'on:change=');
  svelteCode = svelteCode.replace(/onSubmit=/g, 'on:submit=');

  // Replace htmlFor with for
  svelteCode = svelteCode.replace(/htmlFor=/g, 'for=');

  // Replace {variable} with just {variable} (React/Svelte similarities work well here)
  
  // Extract return template
  let template = '';
  const returnMatch = svelteCode.match(/return\s*\(\s*([\s\S]*?)\s*\);/);
  if (returnMatch) {
    template = returnMatch[1];
    // Remove the return statement from the script
    svelteCode = svelteCode.replace(/return\s*\(\s*([\s\S]*?)\s*\);/, '');
  } else {
    // Single line return match
    const singleReturnMatch = svelteCode.match(/return\s+(<[\s\S]*?>);/);
    if (singleReturnMatch) {
      template = singleReturnMatch[1];
      svelteCode = svelteCode.replace(/return\s+(<[\s\S]*?>);/, '');
    }
  }

  // Clean up function declaration
  svelteCode = svelteCode.replace(/export\s+(default\s+)?function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*\{/, '');
  
  // Remove the closing bracket of the function
  const lastBraceIndex = svelteCode.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    svelteCode = svelteCode.substring(0, lastBraceIndex) + svelteCode.substring(lastBraceIndex + 1);
  }

  const scriptContent = svelteCode.trim();
  if (scriptContent) {
    return `<script>\n${scriptContent}\n</script>\n\n${template}`;
  }
  return template;
}

function convertSvelteToTsx(code: string): string {
  let tsxCode = code;

  // Convert basic attributes
  tsxCode = tsxCode.replace(/class=/g, 'className=');
  tsxCode = tsxCode.replace(/on:click=/g, 'onClick=');
  tsxCode = tsxCode.replace(/on:change=/g, 'onChange=');
  tsxCode = tsxCode.replace(/on:submit=/g, 'onSubmit=');
  tsxCode = tsxCode.replace(/for=/g, 'htmlFor=');

  // Extract script block
  let scriptContent = '';
  const scriptMatch = tsxCode.match(/<script.*?>([\s\S]*?)<\/script>/);
  if (scriptMatch) {
    scriptContent = scriptMatch[1].trim();
    tsxCode = tsxCode.replace(/<script.*?>[\s\S]*?<\/script>/, '');
  }

  // Naive let to useState conversion
  let hasUseState = false;
  scriptContent = scriptContent.replace(/let\s+([a-zA-Z0-9_]+)\s*=\s*(.*?);/g, (match, p1, p2) => {
    hasUseState = true;
    const setter = `set${p1.charAt(0).toUpperCase() + p1.slice(1)}`;
    return `const [${p1}, ${setter}] = useState(${p2});`;
  });

  const reactImport = hasUseState 
    ? `import React, { useState } from 'react';` 
    : `import React from 'react';`;

  const scriptBody = scriptContent ? `\n  ${scriptContent.split('\\n').join('\\n  ')}\n` : '';

  return `${reactImport}\n\nexport default function Component() {${scriptBody}\n  return (\n    <>\n      ${tsxCode.trim().split('\\n').join('\\n      ')}\n    </>\n  );\n}\n`;
}
