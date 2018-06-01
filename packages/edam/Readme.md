# Edam
[![NPM version](https://img.shields.io/npm/v/edam.svg?style=flat-square)](https://www.npmjs.com/package/edam)
[![NPM Downloads](https://img.shields.io/npm/dm/edam.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/edam)

💥 The multifunctional scaffold generator.

## Options
- [RCOptions & EdamConfig](./src/types/Options.ts)
- [TemplateConfig](./src/types/TemplateConfig.ts)

## API

```typescript
declare class Edam extends AwaitEventEmitter {
    config: EdamConfig;
    options: Options;
    inquirer: any;
    logger: Logger;
    protected static sourcePullMethods: {
        [name: string]: (source: Source, edam: Edam) => string;
    };
    protected static utils: {
        [name: string]: any;
    };
    static constants: Constants;
    plugins: Array<Plugin>;
    sourcePullMethods: {
        [name: string]: (source: Source, edam: Edam) => string;
    };
    utils: {
        [name: string]: any;
    };
    constants: Constants;
    track: Track;
    constructor(config?: EdamConfig, options?: Options);
    private normalizeConfig();
    use(plugin: Plugin | Plugin[0], options?: {
        force: boolean;
        removeExisted: boolean;
    }): Edam;
    unuse(pluginCore: Plugin[0]): Edam;
    setConfig(config: EdamConfig): Edam;
    setOption(options: Options): Edam;
    promptProcess: PromptProcess;
    prompt: Function;
    private _promptPrivate(prompts?);
    pull(source?: Source): Promise<void>;
    ready(source?: Source): Promise<this>;
    checkConfig(): void;
    run(source?: Source): Promise<FileProcessor>;
    runPlugin(plugin: any): Promise<any>;
    registerPlugins(plugins?: any[]): Promise<void>;
    process(templateConfigPath?: string): Promise<FileProcessor>;
    templateConfig: NormalizedTemplateConfig | TemplateConfig;
    templateConfigPath: string;
    compiler: Compiler;
}
```

