/**
 * @module helpers/border
 */

 import {Object3D, BufferGeometry, LineBasicMaterial, Line, Float32BufferAttribute} from 'three'
const helpersBorder = () => {

  const Constructor = Object3D;
  return class extends Constructor {
    constructor(helpersSlice) {
      //
      super();

      this._helpersSlice = helpersSlice;

      this._visible = true;
      this._color = 0xff0000;
      this._material = null;
      this._geometry = null;
      this._mesh = null;

      this._create();
    }

    set helpersSlice(helpersSlice) {
      this._helpersSlice = helpersSlice;
      this._update();
    }

    get helpersSlice() {
      return this._helpersSlice;
    }

    set visible(visible) {
      this._visible = visible;
      if (this._mesh) {
        this._mesh.visible = this._visible;
      }
    }

    get visible() {
      return this._visible;
    }

    set color(color) {
      this._color = color;
      if (this._material) {
        this._material.color.set(this._color);
      }
    }

    get color() {
      return this._color;
    }

    _create() {
      if (!this._material) {
        this._material = new LineBasicMaterial({
          color: this._color,
          linewidth: 1,
        });
      }

      if (!this._helpersSlice.geometry.vertices) {
        return;
      }

      this._geometry = new BufferGeometry();
  
      // set vertices positions
      const nbOfVertices = this._helpersSlice.geometry.vertices.length;
      const positions = new Float32Array((nbOfVertices + 1) * 3);
      positions.set(this._helpersSlice.geometry.attributes.position.array, 0);
      positions.set(this._helpersSlice.geometry.vertices[0].toArray(), nbOfVertices * 3);
      this._geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );

      this._mesh = new Line(this._geometry, this._material);
      if (this._helpersSlice.aabbSpace === 'IJK') {
        this._mesh.applyMatrix4(this._helpersSlice.stack.ijk2LPS);
      }
      this._mesh.visible = this._visible;

      // and add it!
      this.add(this._mesh);
    }

    _update() {
      // update slice
      if (this._mesh) {
        this.remove(this._mesh);
        this._mesh.geometry.dispose();
        this._mesh = null;
      }

      this._create();
    }

    dispose() {
      this._mesh.material.dispose();
      this._mesh.material = null;
      this._geometry.dispose();
      this._geometry = null;
      this._material.dispose();
      this._material = null;
    }
  };
};

// export factory
export { helpersBorder };
// default export to
export default helpersBorder();
