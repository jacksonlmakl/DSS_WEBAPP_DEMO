import dataiku
import pandas as pd
from flask import request



@app.route('/query_to_df')
def query_to_df():
    query_string = request.args.get('query')
    client=dataiku.api_client()
    r=client.sql_query(connection='EDP_SNOWFLAKE',query=query_string)
    schema= [i['name'] for i in r.get_schema()]
    data = [dict(zip(schema,i))for i in r.iter_rows()]
    return json.dumps({"data": data})
