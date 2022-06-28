import { TileMapProperties } from "../entities/tile-map-properties";

export class PointHelper {

    /**
     * Calcula los pixeles que representa la X de una coordenada
     * @param coordX 
     * @returns 
     */
    static coordXToPixels(properties: TileMapProperties, coordX: number): number {
        let firstX = ~~((properties.layerWidth / 2) / properties.sizeTileWidth);
        let layerBlockX = properties.layerX / properties.sizeTileWidth;
        return (coordX + firstX + layerBlockX) * properties.sizeTileWidth;
    }
    /**
     * Calcula los pixeles que representa la Y de una coordenada
     * @param coordX 
     * @returns 
     */
    static coordYToPixels(properties: TileMapProperties, coordY: number): number {
        let firstY = ~~((properties.layerHeight / 2) / properties.sizeTileHeight);
        let layerBlockY = properties.layerY / properties.sizeTileHeight;
        return (coordY + firstY + layerBlockY) * properties.sizeTileHeight;
    }
    
    static coordXCenter(properties: TileMapProperties, pointX: number): number {
        let firstX = ~~((properties.layerWidth / 2) / properties.sizeTileWidth);
        let pointLayerX = ~~(pointX / (properties.sizeTileWidth * properties.scale));
        let layerBlockX = properties.layerX / properties.sizeTileWidth;
        return pointLayerX - firstX - layerBlockX;
    }
    
    static coordYCenter(properties: TileMapProperties, pointY: number): number {
        let firstY = ~~((properties.layerHeight / 2) / properties.sizeTileHeight);
        let pointLayerY = ~~(pointY / (properties.sizeTileHeight * properties.scale));
        let layerBlockY = properties.layerY / properties.sizeTileHeight;
        return pointLayerY - firstY - layerBlockY;
    }
}