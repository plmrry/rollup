import Node from '../Node.js';

export default class SequenceExpression extends Node {
	getValue () {
		return this.expressions[ this.expressions.length - 1 ].getValue();
	}

	hasEffects ( options ) {
		return this.expressions.some( expression => expression.hasEffects( options ) );
	}

	includeInBundle () {
		if ( this.isFullyIncluded() ) return false;
		let addedNewNodes = false;
		if ( this.expressions[ this.expressions.length - 1 ].includeInBundle() ) {
			addedNewNodes = true;
		}
		this.expressions.forEach( node => {
			if ( node.shouldBeIncluded() ) {
				if ( node.includeInBundle() ) {
					addedNewNodes = true;
				}
			}
		} );
		if ( !this.included || addedNewNodes ) {
			this.included = true;
			return true;
		}
		return false;
	}

	render ( code, es ) {
		if ( !this.module.bundle.treeshake ) {
			super.render( code, es );
		}

		else {
			const last = this.expressions[ this.expressions.length - 1 ];
			const included = this.expressions.slice( 0, this.expressions.length - 1 ).filter( expression => expression.included );

			if ( included.length === 0 ) {
				code.remove( this.start, last.start );
				code.remove( last.end, this.end );
			}

			else {
				let previousEnd = this.start;
				for ( const expression of included ) {
					code.remove( previousEnd, expression.start );
					code.appendLeft( expression.end, ', ' );
					previousEnd = expression.end;
				}

				code.remove( previousEnd, last.start );
				code.remove( last.end, this.end );
			}
		}
	}
}
