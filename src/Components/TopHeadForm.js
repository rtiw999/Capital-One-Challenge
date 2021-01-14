import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Menu, MenuItem, TextField, withStyles, Typography } from '@material-ui/core/';
import countries from './CountriesMap'

const categories = ["Entertainment", "Sports", "Technology"];

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

class TopHead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            country: "",
            category: categories[0],
            sources: "",
            search: "",
            anchorEl: null,
            isValidCountry: true,
            selectedIndex: 0,
        }

    }

    // Handles the parsing of country entry
    handleCountry = (event) => {
        let ct = event.target.value;
        ct = ct.toLowerCase();

        if (countries.get(ct) !== undefined) {
            this.setState({
                country: countries.get(ct),
                isValidCountry: true,
            });
        } else {
            this.setState({ isValidCountry: false });
        }

    }

    // Handles the dropdown for category
    handleCategoryDropdown = (event) => {
        const e = event.currentTarget;
        console.log(e);
        this.setState(() => ({
            anchorEl: e,
        }));
    }

    // Sets category of inquiry for user, stores it in state and closes dropdown
    setCategory = (item) => {
        item = item.toLowerCase();
        this.setState({
            category: item.toLowerCase(),
            anchorEl: null,
        });
        console.log(this.state.category);
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

    // Fetches data from newsAPI by calling parent component's function
    sendParams = () => {
        let request = new URLSearchParams();
        if (this.state.sources !== "") {
            request.append('sources', this.state.sources);
        } else {
            request.append('country', this.state.country);
            request.append('category', this.state.category);
        }

        request.append('q', this.state.search);
        request.append('pageSize', 40);
        request.append('apiKey', `${process.env.APIKEY}`);
        this.props.getParams(request);

    }

    render() {
        const { classes } = this.props;
        return (
            <>
                <main className={classes.layout}>
                    <form id="top-headlines" noValidate autoComplete="off">
                        <Grid container justify="space-around" spacing={2}>
                        <Typography variant='body1' color='textSecondary' align='center' font='Roboto'>
                            Note: If you search for sources, you will not be able to search by country or categories.
                        </Typography>
                            <Grid item xs={12} sm={6}>
                                <TextField id="country" variant="filled" label="Country" error={!this.state.isValidCountry}
                                    onInput={event => { this.handleCountry(event) }} helperText={(!this.state.isValidCountry) ? "Invalid country" : null} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField id="sources" variant="filled" color='secondary' label="Sources" helperText="Choose news source(s) you trust!"
                                    onChange={newValue => { this.changeSources(newValue) }} />
                            </Grid>
                            <Grid item xs={6} sm={12}>
                                <TextField variant="outlined" placeholder={this.state.category[0].toUpperCase() + this.state.category.slice(1)}
                                    aria-haspopup="true" aria-controls="categories" onClick={(e) => this.handleCategoryDropdown(e)} />
                                <Menu id="categories" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)}>
                                    {categories.map(category => (
                                        <MenuItem
                                            key={category}
                                            open={Boolean(this.state.anchorEl)}
                                            onClick={() => this.setCategory(category)}
                                        >
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Grid>
                            <Grid item xs={4} sm={6}>
                                <TextField id="q" label="Search" variant="filled" helperText="Enter any keyword(s) you're looking for"
                                    onChange={(event => this.setState({ search: event.target.value }))} />
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
TopHead.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(TopHead);