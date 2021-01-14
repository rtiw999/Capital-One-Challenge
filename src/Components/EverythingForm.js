import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Menu, MenuItem, TextField, withStyles } from '@material-ui/core/';

const sortSelectors = new Map();
sortSelectors.set('Relevance', 'relevancy');
sortSelectors.set('Popularity', 'popularity');
sortSelectors.set('Publish Date', 'publishedAt');

const useStyles = theme => ({
    layout: {
        alignItems: 'space-around',
        width: 'auto',
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
});

class Everything extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sortBy: "",
            sources: "",
            search: "",
            anchorEl: null,
            searchTitle: "",
            domains: "",
            excludeDomains: ""
        }
        this.dropDown = React.createRef();
    }

    // Handles the dropdown for category
    handleCategoryDropdown = () => {
        const e = this.dropDown.current;
        console.log('This the current element: ' + e);
        this.setState(() => ({
            anchorEl: e,
        }));
    }

    // Sets category of inquiry for user, stores it in state and closes dropdown
    setSort = (item) => {
        this.setState({
            sortBy: sortSelectors.get(item),
            anchorEl: null,
        });
        console.log(this.state.sortBy);
    }

    // Changes the sources the user wishes to search for, stores it in state
    changeSources = (event) => {
        let value = event.target.value
        value = value.toLowerCase();
        value = value.split(", ").join(",");
        console.log("value: " + value)

        value = value.replaceAll(" ", "-");
        console.log("Value after change: " + value);

        this.setState({ sources: value });
        console.log("Sources: " + this.state.sources)
    }

    // Parse the domains a user enters (for inclusion or exclusion) so they're URL friendly
    changeDomains = (event, include) => {
        let value = event.target.value
        value = value.toLowerCase();
        value = value.split(", ").join(",");

        if (include) {
            this.setState({ domains: value });
        } else {
            this.setState({ excludeDomains: value });
        }
    }

    // Fetches data from newsAPI by calling parent component's function
    sendParams = () => {
        let request = new URLSearchParams({
            q: this.state.search,
            qInTitle: this.state.searchTitle,
            domians: this.state.domains,
            excludeDomains: this.state.excludeDomains,
            sortBy: this.state.sortBy,
            sources: this.state.sources,
            pageSize: 40
        });

        request.append('apiKey', "45ddf7b6d9384d2fb060af94f269b846"); // `${process.env.APIKEY}`
        this.props.getParams(request);
    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <main className={classes.layout}>
                    <form id="everything" noValidate autoComplete="off">
                        <Grid container justify="space-around" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField id="q" label="Search" variant="filled" helperText="Enter any keyword(s) you're looking for"
                                    onChange={(event => this.setState({ search: event.target.value }))} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="qInTitle" variant="filled" color='secondary' label="Title" helperText="Choose to search for keywords in article titles"
                                    onChange={event => this.setState({ searchTitle: event.target.value })} />
                            </Grid>
                            <Grid item xs={6} sm={12}>
                                <TextField ref={this.dropDown} variant="outlined" placeholder={this.state.sortBy} helperText="Choose a way to sort your results"
                                    aria-haspopup="true" aria-controls="sort" onClick={this.handleCategoryDropdown} />
                                <Menu id="sort" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)}>
                                    {[...sortSelectors.keys()].map((key) => (/* Got to change this cateogry stuff to sort selection */
                                        <MenuItem
                                            key={key}
                                            open={Boolean(this.state.anchorEl)}
                                            onClick={() => this.setSort(key)}
                                        >
                                            {key}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="domains" variant="filled" color='secondary' label="Domains" helperText="Enter domains you'd like to search, i.e. bbc.co.uk"
                                    onChange={newValue => { this.changeDomains(newValue, true) }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="sources" variant="filled" color='secondary' label="Sources" helperText="Enter domains you would NOT like to search, i.e. bbc.co.uk"
                                    onChange={newValue => { this.changeDomains(newValue, false) }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="sources" variant="filled" color='secondary' label="Sources" helperText="Choose news source(s) you trust!"
                                    onChange={newValue => { this.changeSources(newValue) }} />
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container justify='flex-end'>
                        <Grid item sm={6} xs={12}>
                            <Button className={classes.button} color="secondary" id="submit" onClick={this.sendParams}>GO</Button>
                        </Grid>
                    </Grid>
                </main>
            </>
        );
    }
}

// Sets props to include the styling from useStyles()
Everything.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Everything);