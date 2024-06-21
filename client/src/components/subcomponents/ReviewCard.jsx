import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { red, purple, green, blue, orange } from '@mui/material/colors';
import {formatDate} from '../Utils'

export default function ReviewCard(props) {
    // colors array for doing random color on avatar of review
    const colors = [red[500], purple[500], green[500], blue[500], orange[500]]
    return(
        <Card id={props.id + "__" + props.createdAt}>
            <CardHeader avatar={<Avatar sx={{ bgcolor: colors[Math.floor(Math.random() * 5)] }} aria-label="recipe"> {props.name.slice(0,1)} </Avatar>} 
                        title={props.rating + "☆ from " + props.name} 
                        subheader={formatDate(props.createdAt)} /> 
            <CardContent> 
                <p> {props.comment ? props.comment : <i> no comment </i>} </p>
            </CardContent>
        </Card>
    )
}