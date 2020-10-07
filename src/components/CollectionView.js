import React, { Component } from "react"
import { ScrollView, FlatList } from "react-native"
import PropTypes from "prop-types"

const cardSizeRatio = 16 / 9

class CollectionView extends Component {

	constructor(props) {
		super(props)
		this.state = { cardSize: { width: 0, height: 0 } }
		this.nbOfColumns = 1
	}

	componentWillMount() {
		const { size } = this.props
		this.sizeCards(size)
	}

	componentWillReceiveProps(nextProps) {
		const { size } = nextProps
		if (size !== this.props.size) {
			this.sizeCards(size)
		}
	}

	sizeCards = (size) => {
		const { maxCardWidth, cardSpacing } = this.props
		const { width } = size
		this.nbOfColumns = Math.ceil((width - cardSpacing) / (maxCardWidth + cardSpacing))
		const cardWidth = (width - cardSpacing) / this.nbOfColumns - cardSpacing
		this.setState({ cardSize: { width: cardWidth, height: cardWidth / cardSizeRatio } })
	}

	render() {
		const {
			data, renderItem, extraData, cardSpacing,
		} = this.props
		const { cardSize } = this.state
		return (
			<ScrollView showsVerticalScrollIndicator={ true }>
				<FlatList
					data={ data }
					extraData={ extraData }
					renderItem={
						({ item, index }) => renderItem(item, cardSize, cardSpacing, (index < this.nbOfColumns))
					}
					horizontal={ false }
					numColumns={ this.nbOfColumns }
					key={ this.nbOfColumns }
					keyExtractor={ (item, index) => index.toString() }
				/>
			</ScrollView>
		)
	}

}

CollectionView.propTypes = {
	data: PropTypes.array.isRequired,
	renderItem: PropTypes.func.isRequired,
	extraData: PropTypes.object,
	size: PropTypes.object.isRequired,
	maxCardWidth: PropTypes.number.isRequired,
	cardSpacing: PropTypes.number.isRequired,
}

export default CollectionView