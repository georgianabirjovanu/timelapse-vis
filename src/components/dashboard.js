import { DashboardContextProvider } from '@splunk/dashboard-context';
import GeoRegistry from '@splunk/dashboard-context/GeoRegistry';
import GeoJsonProvider from '@splunk/dashboard-context/GeoJsonProvider';
import DashboardCore from '@splunk/dashboard-core';
import React, { Suspense, useMemo, useEffect, useRef } from 'react';
import Loading from './loading';
import defaultPreset from './preset';
import { SayCheese, registerScreenshotReadinessDep } from './ready';

const PROD_SRC_PREFIXES = ['', 'https://election2020.splunkforgood.com'];

function updateAssetUrls(orig, { origin = window.location.origin } = {}) {
    const images = new Set();
    const def = JSON.parse(JSON.stringify(orig));
    const normalizeImageUrl = (url) => {
        if (url.startsWith('/')) {
            return `${origin}${url}`;
        }
        for (const prefix of PROD_SRC_PREFIXES) {
            if (url.startsWith(prefix)) {
                return `${origin}${url.slice(prefix.length)}`;
            }
        }
        return url;
    };
    // Convert server-relative URLs to absolute URLs before rendering
    for (const viz of Object.values(def.visualizations)) {
        if (viz.type === 'viz.singlevalueicon' && viz.options.icon) {
            viz.options.icon = normalizeImageUrl(viz.options.icon);
            images.add(viz.options.src);
        }
        if (viz.type === 'viz.img' && viz.options.src) {
            viz.options.src = normalizeImageUrl(viz.options.src);
            images.add(viz.options.src);
        }
    }
    if (def.layout.options.backgroundImage && def.layout.options.backgroundImage.src) {
        def.layout.options.backgroundImage.src = normalizeImageUrl(def.layout.options.backgroundImage.src);
        images.add(def.layout.options.backgroundImage.src);
    }
    if (!def.layout.options.backgroundColor) {
        def.layout.options.backgroundColor = '#ffffff';
    }
    delete def.theme;
    return [def, [...images]];
}

class Img {
    constructor(src) {
        this.src = src;
        this.image = new Image();
        this.promise = new Promise((resolve, reject) => {
            this.image.onload = resolve;
            this.image.onerror = reject;
            this.image.src = src;
        });
    }
}

function preloadImages(images) {
    useEffect(() => {
        const readyDef = registerScreenshotReadinessDep(`IMGs[${images.length}]`);
        const imgs = images.map((src) => new Img(src));
        Promise.all(imgs.map((img) => img.promise)).then(() => {
            readyDef.ready();
        });
        return () => {
            readyDef.remove();
        };
    }, [images]);
}

export default function Dashboard({ definition, preset, width = '100vw', height = '100vh' }) {
    const [processedDef, images] = useMemo(() => updateAssetUrls(definition), [definition]);
    preloadImages(images);
    const geoRegistry = useMemo(() => {
        const geoRegistry = GeoRegistry.create();
        geoRegistry.addDefaultProvider(new GeoJsonProvider());
        return geoRegistry;
    }, []);

    const testRef = useRef();
    useEffect(() => {
        const readyDep = registerScreenshotReadinessDep('DASH');
        const t = setTimeout(() => readyDep.ready(), 500);
        return () => {
            clearTimeout(t);
            readyDep.remove();
        };
    }, [testRef]);

    return (
        <DashboardContextProvider geoRegistry={geoRegistry} featureFlags={{ enableSvgHttpDownloader: true }}>
            <Suspense fallback={<Loading />}>
                <SayCheese />
                <DashboardCore
                    ref={testRef}
                    preset={preset || defaultPreset}
                    definition={processedDef}
                    mode="view"
                    width={width}
                    height={height}
                />
            </Suspense>
        </DashboardContextProvider>
    );
}
