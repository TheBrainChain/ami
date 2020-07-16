/**
 * Helpers material mixin.
 *
 * @module helpers/material/mixin
 */

 import {Object3D, ShaderMaterial, DataTexture,UnsignedByteType, UVMapping, ClampToEdgeWrapping, NearestFilter} from 'three'

const helpersMaterialMixin = () => {

  const Constructor = Object3D;
  return class extends Constructor {
    _createMaterial(extraOptions) {
      // generate shaders on-demand!
      let fs = new this._shadersFragment(this._uniforms);
      let vs = new this._shadersVertex();

      // material
      let globalOptions = {
        uniforms: this._uniforms,
        vertexShader: vs.compute(),
        fragmentShader: fs.compute(),
      };

      let options = Object.assign(extraOptions, globalOptions);
      this._material = new ShaderMaterial(options);
      this._material.needsUpdate = true;
    }

    _updateMaterial() {
      // generate shaders on-demand!
      let fs = new this._shadersFragment(this._uniforms);
      let vs = new this._shadersVertex();

      this._material.vertexShader = vs.compute();
      this._material.fragmentShader = fs.compute();

      this._material.needsUpdate = true;
    }

    _prepareTexture() {
      this._textures = [];
      for (let m = 0; m < this._stack._rawData.length; m++) {
        let tex = new DataTexture(
          this._stack.rawData[m],
          this._stack.textureSize,
          this._stack.textureSize,
          this._stack.textureType,
          UnsignedByteType,
          UVMapping,
          ClampToEdgeWrapping,
          ClampToEdgeWrapping,
          NearestFilter,
          NearestFilter
        );
        tex.needsUpdate = true;
        tex.flipY = true;
        this._textures.push(tex);
      }
    }
  };
};

export { helpersMaterialMixin };
export default helpersMaterialMixin();
